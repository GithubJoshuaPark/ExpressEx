// const response = await fetch('http://localhost:3500/auth', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify({user: 'IMSI', pwd: 'IMSI' })
//     });
// console.log(response);

fetch('http://localhost:3500/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({user: 'IMSI', pwd: 'IMSI' })
    }).then((response) => response.json())
    .then((data) => console.log(data));