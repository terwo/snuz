# Backend Service
Backend started with the template from https://github.com/DefangLabs/samples/tree/main/samples/fastapi

The backend uses FastAPI and Supabase.

## Development

To run the development container(s) locally, do:

```bash
docker compose -f compose.dev.yaml up --build
```

Make sure to have a `.env` file with the secrets nessesary to connect to the supabase database

## Configuration

For this sample, you will need to provide the following [configuration](https://docs.defang.io/docs/concepts/configuration): 
###
``` bash
defang config set POSTGRES_PASSWORD
```

## Deployment

> [!NOTE]
> Download [Defang CLI](https://github.com/DefangLabs/defang)

### Defang Playground

Deploy your application to the Defang Playground by opening up your terminal and typing:
```bash
defang --provider=defang compose up
```