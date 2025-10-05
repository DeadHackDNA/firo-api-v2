# Crear un objeto PowerShell
$body = @{
  name  = "Edward Mendoza"
  email = "edward@example.com"
}

# Convertir el objeto a JSON
$json = $body | ConvertTo-Json -Compress

# Mostrar el JSON para verificar
Write-Host "JSON enviado:" $json

# Enviar la petición POST
$response = curl.exe -X POST "http://localhost:3000/api/users" `
  -H "Content-Type: application/json" `
  --data-raw $json

Write-Host "Respuesta del servidor:" $response
