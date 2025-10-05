# Si obtuviste $res.id en el paso 1:
$userId = $res.id

$body = @{
  userId = $userId
  sender = "USER"
  content = "Hola, ¿qué puedo hacer si alguien me acosa en redes sociales?"
  intent = "consulta_ayuda"
  entities = @{ topic = "ciberacoso" }
  sentiment = "neutral"
} | ConvertTo-Json -Depth 5

$resp = curl.exe -s -X POST "http://localhost:3000/api/messages" -H "Content-Type: application/json" --data-raw $body
$parsed = $resp | ConvertFrom-Json
$parsed | ConvertTo-Json
# ver conversationId y el mensaje del bot (si existe)
$parsed.conversationId
$parsed.botMessage.content
