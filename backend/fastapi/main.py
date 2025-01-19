import uuid
import logging
from typing import List, Optional

from fastapi import FastAPI, Form, HTTPException


from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

from sqlalchemy import Boolean, Column, Date, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base


logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)
Base = declarative_base()
load_dotenv()


class UserModel(Base):
    __tablename__ = 'users'
    username = Column(String, primary_key=True, nullable=False)
    owns_a_group = Column(Boolean, nullable=False, default=False)
    group_id = Column(String, ForeignKey('groups.group_id'), nullable=True, default=None)


class GroupModel(Base):
    __tablename__ = 'groups'
    group_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), nullable=False)
    owner_id = Column(String, ForeignKey('users.username'), nullable=True)
    group_name = Column(String, nullable=False)
    to_sleep_time = Column(Date, nullable=False)
    to_wake_up_time = Column(Date, nullable=False)
    duration_days = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    

user = os.getenv("user")
password = os.getenv("password")
host = os.getenv("host")
dbname = os.getenv("dbname")

# Construct the SQLAlchemy connection URL
DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{host}:5432/{dbname}?sslmode=require"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True)
Base.metadata.create_all(bind=engine)

# Create a sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# test the connection
try:
    with engine.connect() as connection:
        log.debug("connection successful!")
except Exception as e:
    log.critical(f"failed to connect: {e}")
    raise e


app = FastAPI()


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

@app.post("/get-user-data")
async def user(username: str = Form(...)):
    with SessionLocal() as db:
        if (user := find_user(db, username)) is None:
            raise HTTPException(status_code=500, detail=f"User does not exist: {username}")
    return {
        "message": "user found",
        "username": user.username,
        "owns_a_group": user.owns_a_group,
        "group_id": user.group_id
    }

# #############################
# # GROUP OPERATION ENDPOINTS #
# #############################

# @app.post("/create-group")
# async def create_group(create_group: CreateGroupModel):
#     return {"message": f"TODO: group created ({create_group})"}


# @app.get("/get-join-group-requests")
# async def get_join_group_requests():
#     """
#     Mobile app will have to poll this endpoint check check to see if 
#     a join request has been sent to them.
    
#     TODO: server-sent events or firebase cloud messaging
#     """
#     return {"message": "TODO: get join group requests"}


# ######################
# # SLEEPING ENDPOINTS #
# ######################

# @app.post("/user_sleep")
# async def sleep(user_sleep: UserSleepModel):
#     return {"message": "TODO: mark user as sleeping"}


# @app.post("/user_awake")
# async def sleep(user_sleep: UserSleepModel):
#     return {"message": "TODO: mark user as awake"}


# @app.post("/user_snooze")
# async def sleep(user_sleep: UserSleepModel):
#     return {"message": "TODO: mark user as snoozing"}

# ###########
# # FRIENDS #
# ###########

# @app.post("/add-friend")
# async def add_friend(user: UserModel, friend: UserModel):
#     return {"message": "TODO: add friend"}

# @app.get("/accept-friend")
# async def get_friends(user: UserModel, friend: UserModel):
#     return {"message": "TODO: get friends"}



def find_user(db: sessionmaker, username: str) -> Optional[UserModel]:
    return db.query(UserModel).filter(UserModel.username == username).first()
