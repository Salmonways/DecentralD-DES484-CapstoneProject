- To open the frontend:
    1. stay in the my-react-app repo
    2. run in terminal npm run dev
- To open the backend:
    1. stay in the my-react-app/backend repo
    2. run in terminal node server.js
- To open the database:
    1. open MAMP MySQL
    2. open phpMyAdmin
    3. import .sql from database
- To open blockchain: 
    1. cd ~/Developer/DES484/Capstone-Project-main/my-react-app/blockchain
    2. run in terminal npx hardhat node
    3. vite private key in .env my-react-app: copy the local private key from the terminal and put in .env file in my-react-app folder at VITE_PRIVATE_KEY
    4. vite contracts address in .env my-react-app: run in terminal npx hardhat run scripts/deploy.cjs --network localhost then copy contract address to VITE_CONTRACT_ADDRESS at .env file in my-react-app
    5. infura project id in .env in blockchain repo: open infura and sign in the copy id and insert in INFURA_PROJECT_ID=https://mainnet.infura.io/v3/infura_project_id
    6. private key in .env in blockchain repo: same as vite private key
    7. contract address in .env in blockchain repo: same as vite contract address