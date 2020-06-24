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