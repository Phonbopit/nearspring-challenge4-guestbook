CONTRACT_ID := guestbook.0xchai.testnet

deploy:
	near deploy --wasmFile out/main.wasm --accountId ${CONTRACT_ID}