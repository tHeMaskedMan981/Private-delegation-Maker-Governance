# proof related APIs 

## Generate random secret 

- url : /generate_secret/
- generate 256 bit random secret. returned in Hex. 
- method : GET
- response: 
```json
{
    "secret": "3a31440d59de67d8c0371554991b2439500b720bfc171453ccb9074a68a5f7f8"
}
```

## Get secret Hash

- url : /delegate/hash/
- get SHA256 hash of the secret using circuit
- method : POST
- request : 
```json 
{
	"secret":"3a31440d59de67d8c0371554991b2439500b720bfc171453ccb9074a68a5f7f8"
}
```
- response: 
```json
{
    "hash": "bf81ada068fd2d24cf9b8c474bc5217a3ea75bde29c40b32c38cd9a3c5ac2e34"
}
```

## Get zk Proof

- url : /delegate/proof/
- get zk proof of preimage of sha256
- method : POST
- request : 
```json 
{
	"secret":"3a31440d59de67d8c0371554991b2439500b720bfc171453ccb9074a68a5f7f8",
	"secret_hash":"bf81ada068fd2d24cf9b8c474bc5217a3ea75bde29c40b32c38cd9a3c5ac2e34"
}

```
- response: 
```json
{
    "proof": {
        "a": [
            "0x2a259a7b7c498979d14d1db5a56fe25999cd6d1090d10aae78523e303d47bdfa",
            "0x27c56f84bcd7646e8fe48b48c9c3336405acb62400fc313285f9ffe778a7ef30"
        ],
        "b": [
            [
                "0x299c46567d5e7f87c687cc11f7d75ba7a0e3df619b505fce662eaee10f1827cb",
                "0x1a2d7238214f451ec81491d73c60e1d61ed5c6a03cb3df067352ecee8377732a"
            ],
            [
                "0x2a62cc32d367b74b1c1c805a66bc3b8b378c4233b474a6d98a7ca8093ba01a6d",
                "0x24e41593ed8ee20464f5581eef364e95afbb3b59327654de8c248c02283a6716"
            ]
        ],
        "c": [
            "0x132364ba554938d36772fc872546c7619071c890c7bc8d8346f5dabb9731825e",
            "0x26a30373ecd727648a84fabe216a240bc6385198ce742fdaa032b07970b363cd"
        ]
    },
    "inputs": [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000005",
        "0x0000000000000000000000000000000096de8fc8c256fa1e1556d41af431cace",
        "0x000000000000000000000000000000007dca68707c78dd88c3acab8b17164c47"
    ]
}
```

## Verify zk Proof

- url : /delegate/verify/
- verifies the zk proof on-chain
- method : POST
- request : 
```json 
{
	"proof":{

        "proof": {

            "a": ["0x29da7ea8ab9fb249262bde5e28400b7d4c8ff5fe66f9a7f3057b08bea06e2321", "0x0b130d35748b8dc379450f2dd0a7b56a58016f03d18e1a8dc58e9d71ee8a06e1"],
            
            "b": [["0x05556a0f52002f7d5b88c163acc3d0653eb8461bc7aa6a22b2b281b5e373fd01", "0x0257331d7b0bcdb19d07dba458100b624395fd5daefc11c0ccd13dad8c0d6fe2"], ["0x0f0967b5ca3245a0b687b56a7bf75a9d2a4a73a536f292bb272c9a684ebc4329", "0x1b94c0a4c130fa8538b1425a5b645020e94b03335ed7fc0b068f57526e2554fb"]],

            "c": ["0x28d5443ca4fa3acbc7447ffaaf34e7d74a6c6d755d813b87f19134de0a88fdc9", "0x0036bd7b349b279ed88c7d1584078e9fb0718f419888b02f2d56c38e964f3552"]
        },

        "inputs": ["0x000000000000000000000000000000000fef70c5249a20db7e4e4a2c799e0906", "0x00000000000000000000000000000000ba4ddcbf9d496825b2f23e4b0976a734", "0x0000000000000000000000000000000000000000000000000000000000000001"]
        
    }
}

```
- response: 
```json
{
    "result": true
}
```