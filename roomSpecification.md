  "servers": [
    {
      "url": "http://3.39.207.166:8080",
      "description": "Generated server url"
    }
  ],
  "tags": [
    {
      "name": "논의방 API",
      "description": "논의방 생성, 조회, 입장, 삭제 관련 API"
    },
    {
      "name": "Auth",
      "description": "사용자 인증 API"
    },
    {
      "name": "User",
      "description": "회원가입 및 회원관련 API"
    },
    {
      "name": "Chat",
      "description": "채팅 관련 API"
    }
  ],
  "paths": {
    "/api/users/signup": {
      "post": {
        "tags": [
          "User"
        ],
        "summary": "회원가입",
        "description": "새로운 사용자를 등록합니다.",
        "operationId": "signUp",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SignUpRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseSignUpResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/users/email/verify": {
      "post": {
        "tags": [
          "User"
        ],
        "summary": "이메일 인증번호 검증",
        "description": "발송된 인증번호를 검증합니다.",
        "operationId": "verifyEmail",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/VerifyEmailRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseVoid"
                }
              }
            }
          }
        }
      }
    },
    "/api/users/email/send": {
      "post": {
        "tags": [
          "User"
        ],
        "summary": "이메일 인증번호 발송",
        "description": "입력한 이메일로 6자리 인증번호를 발송합니다. (유효시간: 5분)",
        "operationId": "sendEmailVerification",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "additionalProperties": {
                  "type": "string"
                }
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseVoid"
                }
              }
            }
          }
        }
      }
    },
    "/api/discussion-rooms/{roomId}/join": {
      "post": {
        "tags": [
          "논의방 API"
        ],
        "summary": "논의방 입장",
        "description": "논의방에 입장합니다. 입장 시 방 정보와 멤버 목록을 제공합니다.",
        "operationId": "joinRoom",
        "parameters": [
          {
            "name": "roomId",
            "in": "path",
            "description": "논의방 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            },
            "example": 1
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseJoinRoomRes"
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ]
      }
    },
    "/api/discussion-rooms/create": {
      "post": {
        "tags": [
          "논의방 API"
        ],
        "summary": "논의방 생성",
        "description": "새로운 논의방을 생성합니다. 생성자는 자동으로 방에 참여됩니다.",
        "operationId": "createRoom",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateDiscussionRoomReq"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseJoinRoomRes"
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ]
      }
    },