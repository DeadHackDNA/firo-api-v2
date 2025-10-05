$body = '{"name":"Edward Mendoza","email":"edward@example.com"}'
curl.exe -s -X POST "http://localhost:3000/api/users" -H "Content-Type: application/json" --data-raw $body
