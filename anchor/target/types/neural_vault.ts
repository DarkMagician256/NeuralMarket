/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/neural_vault.json`.
 */
export type NeuralVault = {
  "address": "A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F",
  "metadata": {
    "name": "neuralVault",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Neural Market Vault Contract"
  },
  "instructions": [
    {
      "name": "createAgent",
      "docs": [
        "Create a new agent with unique ID (multiple per wallet)"
      ],
      "discriminator": [
        143,
        66,
        198,
        95,
        110,
        85,
        83,
        249
      ],
      "accounts": [
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "agentId"
              }
            ]
          }
        },
        {
          "name": "userStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  115,
                  116,
                  97,
                  116,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "agentId",
          "type": "u64"
        },
        {
          "name": "archetype",
          "type": "u8"
        },
        {
          "name": "riskLevel",
          "type": "u8"
        },
        {
          "name": "capital",
          "type": "u64"
        },
        {
          "name": "leverage",
          "type": "u8"
        },
        {
          "name": "name",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "createAgentStandalone",
      "docs": [
        "Create agent without requiring UserStats (standalone mode)"
      ],
      "discriminator": [
        241,
        88,
        137,
        72,
        131,
        130,
        234,
        142
      ],
      "accounts": [
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "agentId"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "agentId",
          "type": "u64"
        },
        {
          "name": "archetype",
          "type": "u8"
        },
        {
          "name": "riskLevel",
          "type": "u8"
        },
        {
          "name": "capital",
          "type": "u64"
        },
        {
          "name": "leverage",
          "type": "u8"
        },
        {
          "name": "name",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "deactivateAgent",
      "docs": [
        "Deactivate an agent"
      ],
      "discriminator": [
        205,
        171,
        239,
        225,
        82,
        126,
        96,
        166
      ],
      "accounts": [
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "agentId"
              }
            ]
          }
        },
        {
          "name": "user",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "agentId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeUser",
      "docs": [
        "Initialize user profile (one per wallet)"
      ],
      "discriminator": [
        111,
        17,
        185,
        250,
        60,
        122,
        38,
        254
      ],
      "accounts": [
        {
          "name": "userStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  115,
                  116,
                  97,
                  116,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "reactivateAgent",
      "docs": [
        "Reactivate an agent"
      ],
      "discriminator": [
        231,
        7,
        179,
        97,
        210,
        24,
        209,
        12
      ],
      "accounts": [
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "agentId"
              }
            ]
          }
        },
        {
          "name": "user",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "agentId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "recordAgentPrediction",
      "docs": [
        "Record a prediction for a specific agent"
      ],
      "discriminator": [
        220,
        248,
        109,
        208,
        167,
        225,
        43,
        221
      ],
      "accounts": [
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "agentId"
              }
            ]
          }
        },
        {
          "name": "userStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  115,
                  116,
                  97,
                  116,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "agentId",
          "type": "u64"
        },
        {
          "name": "volume",
          "type": "u64"
        },
        {
          "name": "predictionHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "isProfitable",
          "type": "bool"
        },
        {
          "name": "pnl",
          "type": "i64"
        }
      ]
    },
    {
      "name": "recordPrediction",
      "docs": [
        "Legacy: Record prediction (backwards compatibility)"
      ],
      "discriminator": [
        6,
        250,
        152,
        187,
        248,
        58,
        42,
        136
      ],
      "accounts": [
        {
          "name": "userStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  115,
                  116,
                  97,
                  116,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "volume",
          "type": "u64"
        },
        {
          "name": "predictionHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "recordTradeStandalone",
      "docs": [
        "Record trade for agent (standalone - no UserStats dependency)"
      ],
      "discriminator": [
        185,
        82,
        112,
        160,
        25,
        99,
        114,
        189
      ],
      "accounts": [
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "agentId"
              }
            ]
          }
        },
        {
          "name": "user",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "agentId",
          "type": "u64"
        },
        {
          "name": "volume",
          "type": "u64"
        },
        {
          "name": "isProfitable",
          "type": "bool"
        },
        {
          "name": "pnl",
          "type": "i64"
        }
      ]
    },
    {
      "name": "submitTradeIntent",
      "docs": [
        "Execute a Trade Intent (DFlow Integration)",
        "Emits an event that off-chain solvers listen to for execution."
      ],
      "discriminator": [
        245,
        251,
        52,
        204,
        255,
        200,
        170,
        169
      ],
      "accounts": [
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "agentId"
              }
            ]
          }
        },
        {
          "name": "user",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "agentId",
          "type": "u64"
        },
        {
          "name": "marketTicker",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "side",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "limitPrice",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "agent",
      "discriminator": [
        47,
        166,
        112,
        147,
        155,
        197,
        86,
        7
      ]
    },
    {
      "name": "userStats",
      "discriminator": [
        176,
        223,
        136,
        27,
        122,
        79,
        32,
        227
      ]
    }
  ],
  "events": [
    {
      "name": "agentCreated",
      "discriminator": [
        237,
        44,
        61,
        111,
        90,
        251,
        241,
        34
      ]
    },
    {
      "name": "legacyPredictionMade",
      "discriminator": [
        166,
        206,
        43,
        244,
        55,
        153,
        110,
        247
      ]
    },
    {
      "name": "predictionMade",
      "discriminator": [
        236,
        224,
        49,
        142,
        71,
        154,
        115,
        157
      ]
    },
    {
      "name": "tradeIntentSubmitted",
      "discriminator": [
        166,
        178,
        105,
        81,
        170,
        74,
        231,
        223
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "agentInactive",
      "msg": "Agent is currently inactive."
    }
  ],
  "types": [
    {
      "name": "agent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "agentId",
            "type": "u64"
          },
          {
            "name": "archetype",
            "type": "u8"
          },
          {
            "name": "riskLevel",
            "type": "u8"
          },
          {
            "name": "capital",
            "type": "u64"
          },
          {
            "name": "leverage",
            "type": "u8"
          },
          {
            "name": "name",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "totalTrades",
            "type": "u64"
          },
          {
            "name": "profitableTrades",
            "type": "u64"
          },
          {
            "name": "totalPnl",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "agentCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "agentId",
            "type": "u64"
          },
          {
            "name": "archetype",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "legacyPredictionMade",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "volume",
            "type": "u64"
          },
          {
            "name": "predictionHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "predictionMade",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "agentId",
            "type": "u64"
          },
          {
            "name": "volume",
            "type": "u64"
          },
          {
            "name": "predictionHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "pnl",
            "type": "i64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "tradeIntentSubmitted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agentId",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "marketTicker",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "side",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "totalVolume",
            "type": "u64"
          },
          {
            "name": "predictionsCount",
            "type": "u64"
          },
          {
            "name": "correctPredictions",
            "type": "u64"
          },
          {
            "name": "agentsCount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
