import asyncio
from dataclasses import dataclass
import datetime as dt
from dateutil import parser as datetime_parser
import json
import logging
import math
import os
from typing import List, Optional
import uuid

from dotenv import load_dotenv
from fastapi import FastAPI, Form, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String, Table, Time, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, joinedload

from transformers import pipeline


MAX_SCORE = 100
MIN_SCORE = 0

logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)
generator = pipeline('text-generation', model='gpt2')


##################
# DATABASE SETUP #
##################

Base = declarative_base()
load_dotenv()


user_group_association = Table(
    'user_group_association', Base.metadata,
    Column('user_id', String, ForeignKey('users.username'), primary_key=True),
    Column('group_id', String, ForeignKey('groups.group_id'), primary_key=True)
)


class UserModel(Base):
    __tablename__ = 'users'
    username = Column(String, primary_key=True, nullable=False)
    owns_a_group = Column(Boolean, nullable=False, default=False)

    score = Column(Integer, nullable=False, default=MAX_SCORE)
    average_minutes_slept = Column(Integer, nullable=True)
    is_asleep = Column(Boolean, nullable=False, default=False)
    last_sleep_time = Column(DateTime, nullable=True)
    last_awake_time = Column(DateTime, nullable=True)
    current_snooze_counter = Column(Integer, nullable=False, default=0)
   
    groups = relationship('GroupModel', secondary=user_group_association, back_populates='users')

class GroupModel(Base):
    __tablename__ = 'groups'
    group_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), nullable=False)
    owner_username = Column(String, ForeignKey('users.username'), nullable=True)
    to_sleep_time = Column(DateTime, nullable=False)
    to_wake_up_time = Column(DateTime, nullable=False)
    duration_days = Column(Integer, nullable=False)
    days_remaining = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    
    users = relationship('UserModel', secondary=user_group_association, back_populates='groups')
    

user = os.getenv("user")
password = os.getenv("password")
host = os.getenv("host")
dbname = os.getenv("dbname")

DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{host}:5432/{dbname}?sslmode=require"
engine = create_engine(DATABASE_URL, echo=True)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# test the connection
try:
    with engine.connect() as connection:
        log.debug("connection successful!")
except Exception as e:
    log.critical(f"failed to connect: {e}")
    raise e


#################
# FASTAPI SETUP #
#################

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://alvicorn-fastapi--8000.prod1.defang.dev",
        "ws://alvicorn-fastapi--8000.prod1.defang.dev",
        "wss://alvicorn-fastapi--8000.prod1.defang.dev"
    ],  # can alter with time
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def get_root():
    return {"message": "hello from server"}

##################
# AUTH ENDPOINTS #
##################
@app.post("/create-user")
async def create_user(username: str = Form(...)):
    """
    Add a user to the database.
    """
    if not username.isalnum():
        raise HTTPException(status_code=404, detail=f"User can only contain characters and numbers")
    
    db = SessionLocal()
    
    if find_user(db, username) is not None:
        raise HTTPException(status_code=404, detail=f"User already exists: {username}")
        
    try:
        new_user = UserModel(username=username)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user: {username}")
    finally:
        db.close()
    
    # check for the user
    with SessionLocal() as db:
        if find_user(db, username) is None:
            raise HTTPException(status_code=500, detail=f"Failed to create user: {username}")
        
    return {"message": f"User created: {username}"}

@app.post("/login")
async def login(username: str = Form(...)):
    with SessionLocal() as db:
        user = find_user(db, username)
        if user is None:
            raise HTTPException(status_code=500, detail=f"User does not exist: {username}")
    return {
        "message": "user found",
        "username": user.username
    }

@app.get("/all-user-data")
async def all_user_data():
    with SessionLocal() as db:
        users = db.query(UserModel).all()                
        return {"users": [
            {
                "message": "user found",
                "username": user.username,
                "owns_a_group": user.owns_a_group,
                "group_id": None if not user.groups else user.groups[0].group_id,
                "score": user.score,
                "average_minutes_slept": user.average_minutes_slept,
                "is_asleep": user.is_asleep,
                "last_sleep_time": user.last_sleep_time,
                "last_awake_time": user.last_awake_time
            } for user in users]
        }


#################
# USER-SPECIFIC #
#################

@app.post("/get-user-data")
async def user(username: str = Form(...)):
    with SessionLocal() as db:
        if (user := find_user(db, username)) is None:
            raise HTTPException(status_code=500, detail=f"User does not exist: {username}")
            
    return {
        "message": "user found",
        "username": user.username,
        "owns_a_group": user.owns_a_group,
        "group_id": None if not user.groups else user.groups[0].group_id,
        "score": user.score,
        "average_minutes_slept": user.average_minutes_slept,
        "is_asleep": user.is_asleep,
        "last_sleep_time": user.last_sleep_time,
        "last_awake_time": user.last_awake_time
    }
    
    
@app.post("/to-sleep")
async def to_sleep(username: str = Form(...)):
    with SessionLocal() as db:
        if (user := find_user(db, username)) is None:
            raise HTTPException(status_code=500, detail=f"User does not exist: {username}")
        if not user.groups:
            raise HTTPException(status_code=500, detail=f"{username} is not in a group")
        
        if user.is_asleep:
            raise HTTPException(status_code=500, detail=f"{username} is already asleep!")
        # TODO: prevent from sleepig to early
        user.is_asleep = True
        user.last_sleep_time = dt.datetime.now(dt.timezone.utc)
        user.last_awake_time = None
        user.current_snooze_counter = 0
        
        try:
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to mark user as sleeping: {username}")
    
        prompt = f"{user.username} went to sleep at {user.last_sleep_time}",
        result = result = generator(prompt, max_new_tokens=25, num_return_sequences=1)
        message = result[0]["generated_text"]
       
        await group_websockets[user.groups[0].group_id].broadcast(BroadcastMessage(
            "to-sleep",
            user.username,
            {
                "message": message,
                "asleep": [u.username for u in user.groups[0].users if u.is_asleep]
            }
        ))
    
        return {"message": message}
    return {"message": f"User marked as sleeping: {username}"}

@app.post("/to-awake")
async def to_awake(username: str = Form(...)):
    with SessionLocal() as db:
        if (user := find_user(db, username)) is None:
            raise HTTPException(status_code=500, detail=f"User does not exist: {username}")
        if not (groups := user.groups):
            raise HTTPException(status_code=500, detail=f"{username} is not in a group")
        if not user.is_asleep:
            raise HTTPException(status_code=500, detail=f"{username} is not alseep yet!")
        
        try:
            user.is_asleep = False    
            user.last_awake_time = dt.datetime.now(dt.timezone.utc)
        
            to_sleep_goal = user.groups[0].to_sleep_time.replace(tzinfo=dt.timezone.utc)
            to_awake_goal = user.groups[0].to_wake_up_time.replace(tzinfo=dt.timezone.utc)
            
            last_sleep_time = user.last_sleep_time.replace(tzinfo=dt.timezone.utc)
            today_minutes_slept = int((user.last_awake_time - last_sleep_time).total_seconds() // 60)
            
            if user.average_minutes_slept is None:
                user.average_minutes_slept = today_minutes_slept
            else:
                user.average_minutes_slept = (user.average_minutes_slept + today_minutes_slept) // 2 
            
            minutes_slept_diff = today_minutes_slept - user.average_minutes_slept # if positive, slept more than avg. if negative, slept less than avg. 
            to_sleep_diff = int((to_sleep_goal - last_sleep_time).total_seconds() // (60 * 5))
            to_awake_diff = int((user.last_awake_time - to_awake_goal).total_seconds() // (60 * 5))
            diff_summary = minutes_slept_diff + to_sleep_diff + to_awake_diff
            
            user.score = min(max(math.floor(user.score + (diff_summary * 0.2) - user.current_snooze_counter), MIN_SCORE), MAX_SCORE)    
            user.current_snooze_counter = 0
        
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to mark user as awake: {username}: {e}")
    

        # check if anyone else is awake
        # TODO: what if someone didnt actually sleep?
        everyone_is_awake = True
        group = groups[0]
        for group_member in group.users:
            if group_member.is_asleep:
                everyone_is_awake = False
                break
        
        group_id = group.group_id
        if everyone_is_awake: # update the group data
            try:
                group.days_remaining -= 1
                if group.days_remaining != 0: # update the next sleep time
                    #! Feature not bug. If someone does not sleep, by the time everyone else wakes up, then to bad.
                
                    date_diff = group.duration_days - group.days_remaining
                    new_start_date = group.start_date + dt.timedelta(days=date_diff)
                    new_wake_up_time = group.to_wake_up_time.time()
                    new_sleep_time = group.to_sleep_time.time()
                    
                    group.to_sleep_time = dt.datetime.combine(new_start_date, new_sleep_time)
                    if new_wake_up_time >= new_sleep_time: # sleep and wake up on the same day
                        group.to_wake_up_time = dt.datetime.combine(new_start_date, new_wake_up_time)
                    else:
                        group.to_wake_up_time = dt.datetime.combine(new_start_date + dt.timedelta(days=1), new_wake_up_time)       
                else: # end of sleep challenge                                
                    for user in group.users:
                        group.users.remove(user)
                    db.delete(group)
                    
                db.commit()    
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Failed to update group data: {username}: {e}")         
        # else:
            # TODO: oversleeping penelty
       
        prompt = f"{user.username} woke up at {user.last_awake_time}",
        result = result = generator(prompt, max_new_tokens=25, num_return_sequences=1)
        message = result[0]["generated_text"]
       
        
        await group_websockets[user.groups[0].group_id].broadcast(BroadcastMessage(
            "to-awake",
            user.username,
            {
                "message": message,
                "awake": [u.username for u in user.groups[0].users if not u.is_asleep]
            }
        ))
        
        group_socket = group_websockets.get(group_id)
        if group_socket:
                del group_websockets[group_websockets]
    
        return {"message": message}
    return {"message": f"User marked as awake: {username}"}

@app.post("/to-snooze")
async def to_snooze(username: str = Form(...)):
    with SessionLocal() as db:
        if (user := find_user(db, username)) is None:
            raise HTTPException(status_code=500, detail=f"User does not exist: {username}")        
        if not user.is_asleep:
            raise HTTPException(status_code=500, detail=f"{username} is not asleep yet!")
        
        user.current_snooze_counter += 1
        
        try:
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed increment snooze counter: {username}")
        
        prompt = (
            f"{user.username} let down their team by hitting snooze at {dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)}"
        )
        result = result = generator(prompt, max_new_tokens=25, num_return_sequences=1)
        message = result[0]["generated_text"]
    
        await group_websockets[user.groups[0].group_id].broadcast(BroadcastMessage(
            "to-snooze",
            user.username,
            {
                "message": message,
                "asleep": [u.username for u in user.groups[0].users if u.is_asleep],
                "awake": [u.username for u in user.groups[0].users if not u.is_asleep]
            }
        ))
    return {"message": message}


# #############################
# # GROUP OPERATION ENDPOINTS #
# #############################

class CreateGroupData(BaseModel):
    owner_username: str
    group_members: List[str]
    to_sleep_time: str
    to_wake_up_time: str
    duration_days: int
    start_date: str
    

@app.post("/create-group")
async def create_group(create_group_data: CreateGroupData):
    with SessionLocal() as db:
        if find_user(db, create_group_data.owner_username) is None:
            raise HTTPException(status_code=500, detail=f"Owner does not exist: {create_group_data.owner_username}")
        
        group_members = []
        for member in create_group_data.group_members:
            if (user := find_user(db, member)) is None:
                raise HTTPException(status_code=500, detail=f"Member does not exist: {member}")
            else:
                if not user.groups:
                    group_members.append(user)
                else:
                    raise HTTPException(status_code=400, detail=f"{member} is already a member of another group")
        if create_group_data.duration_days < 1:
            raise HTTPException(status_code=400, detail="Duration must be at least 1 day")
        if datetime_parser.isoparse(create_group_data.start_date) < dt.datetime.now(dt.timezone.utc):
            raise HTTPException(status_code=400, detail="Start date must be in the future")

        if create_group_data.owner_username not in create_group_data.group_members:
            create_group_data.group_members.append(create_group_data.owner_username)
        
        try:        
            if dt.datetime.now(dt.timezone.utc) > datetime_parser.isoparse(create_group_data.to_sleep_time):                
                raise HTTPException(status_code=400, detail="Cannot schedule a sleeping time in the past")
            
            sleep_time = datetime_parser.isoparse(create_group_data.to_sleep_time).time()
            wake_up_time = datetime_parser.isoparse(create_group_data.to_wake_up_time).time()
            start_date = datetime_parser.isoparse(create_group_data.to_wake_up_time).date()
             
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid ISO 8601 format for sleep, wake or start: {e}")
        try:
            if wake_up_time >= sleep_time: # sleep and wake up on the same day
                sleep_time = dt.datetime.combine(start_date, sleep_time)
                wake_up_time = dt.datetime.combine(start_date, wake_up_time)
            else:
                sleep_time = dt.datetime.combine(start_date, sleep_time)
                wake_up_time = dt.datetime.combine(start_date + dt.timedelta(days=1), wake_up_time)
                
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error in combining date and time: {e}")
        
        try:
            new_group = GroupModel(
                owner_username=create_group_data.owner_username,
                to_sleep_time=sleep_time,
                to_wake_up_time=wake_up_time,
                duration_days=create_group_data.duration_days,
                days_remaining=create_group_data.duration_days,
                start_date=start_date
            )
            
            # group to the session
            db.add(new_group)
            db.commit()  # Commit to generate group_id

            # Get the newly created group with the generated group_id
            db.refresh(new_group)

            # Add users (including owner and members) to the group
            for member in group_members:
                new_group.users.append(member)

            # Commit the changes
            db.commit()
            db.refresh(new_group) 
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed create a group: {e}")
        
        group_websockets[new_group.group_id] = GroupWebSocket(new_group.group_id)
        
    return {"message": "Group created successfully"}

@app.post("/my-group")
async def my_group(username: str = Form(...)):
    with SessionLocal() as db:
        if (user := find_user(db, username)) is None:
            raise HTTPException(status_code=500, detail=f"User does not exist: {username}")
        if not (groups := user.groups):
            return {
                "message": f"{username} is not in a group",
                "in_group": False
            }

        group = groups[0]

        return {
            "group_id": group.group_id,
            "owner_username": group.owner_username,
            "group_members": [user.username for user in group.users],
            "to_sleep_time": group.to_sleep_time.strftime("%H:%M:%S"),
            "to_wake_up_time": group.to_wake_up_time.strftime("%H:%M:%S"),
            "duration_days": group.duration_days,
            "days_remaining": group.days_remaining,
            "start_date": group.start_date.strftime("%Y-%m-%d")
        }        


@dataclass
class BroadcastMessage:
    operation: str
    username: str
    data: dict

    def to_string(self):
        return json.dumps({
            "operation": self.operation,
            "username": self.username,
            "message": self.data
        })


class GroupWebSocket:
    def __init__(self, room_id):
        self.room_id = room_id
        self.connections: List[WebSocket] = []

    async def broadcast(self, broadcast_message: BroadcastMessage):
        disconnected_connections = []
        for connection in self.connections:
            try:
                await connection.send_text(broadcast_message.to_string())
            except Exception as e:
                disconnected_connections.append(connection)

        # Remove disconnected connections
        for conn in disconnected_connections:
            self.connections.remove(conn)

group_websockets = {}

@app.websocket('/ws/{username}')
async def websocket_endpoint(websocket: WebSocket, username: str):
    group = None
    with SessionLocal() as db:
        if (user := find_user(db, username)) is None:
            raise HTTPException(status_code=500, detail=f"User does not exist: {username}")
        if not (groups := user.groups):
            raise HTTPException(status_code=500, detail=f"{username} is not in a group")
        group = groups[0]
    
    group_id = group.group_id
    try:
        await websocket.accept()
        if group_id not in group_websockets:
            raise HTTPException(status_code=500, detail=f"group_id does not exist!")

        group_socket = group_websockets[group_id]
        group_socket.connections.append(websocket)

        while True:
            data = await websocket.receive_text()
            await group_socket.broadcast(data, websocket)

    except WebSocketDisconnect:
        group_socket = group_websockets.get(group_id)
        if group_socket:
            # Remove the WebSocket connection from the room
            group_socket.connections.remove(websocket)
            # Clean up the room if it's empty
            if not group_socket.connections:
                del group_websockets[group_websockets]
    except Exception as e:
        raise HTTPException(status_code=500, detail="some errors")






def find_user(db: sessionmaker, username: str) -> Optional[UserModel]:
    return db.query(UserModel).options(joinedload(UserModel.groups)).filter(UserModel.username == username).first()


