To open the frontend:
    Open new terminal
    Run in terminal “cd my-react-app”
    Run in terminal “npm run dev”
    Go to browser url and type “http://localhost:5173/” 
To open the backend:
    Open new terminal
    Run in terminal “cd my-react-app/backend”
    Run in terminal “node server.js” 
To import the database:
    Open MAMP
    Start the server
    Open phpMyAdmin
    import .sql in database folder to the phpMyAdmin
To open blockchain:
    Open new terminal
    Run in terminal “my-react-app/blockchain”
    Run in terminal “npx hardhat node”
    You will see lot of account generated with account numbers and private keys
    Open new terminal
    Run in terminal “my-react-app/blockchain”
    Run in terminal “npx hardhat run scripts/deploy.cjs”
    You will see the contract address, e.g., “Contract deployed to: 0x..."
    Create a file name “.env” in my-react-app repository and type

    VITE_CONTRACT_ADDRESS=Replace with Contract address e.g.0x...
    VITE_PRIVATE_KEY=Replace with Private key of any account e.g 0x..
    VITE_RPC_URL=http://127.0.0.1:8545

    Go to “https://developer.metamask.io/login?redirect=%2Fkey%2Fall-endpoints”
    Sign up or sign in with metamask developer account
    On the left panel go to Infura RPC, then copy the project ID, e.g., 0ff…
    Create a file name “.env” in my-react-app/blockchain repository and type
    
    INFURA_PROJECT_ID=https://mainnet.infura.io/v3/Replace with project ID.
    PRIVATE_KEY=Replace with the same Private key
    CONTRACT_ADDRESS=Replace with the same Contract address
    RPC_URL=http://127.0.0.1:8545
