console.log('Online')

let socket = io();

getElement('id', 'findGame').addEventListener('submit', async (e) => {
     e.preventDefault();
     let id = getElement('id', 'gameId').value;
     try {
     const options = {
          'method': 'POST',
          'headers': {
               'content-type': 'application/json'
          },
          'body': JSON.stringify({ redirect: true })
     }
     console.log(id)
     let fetched = await fetch(`/${id}`, options)
     let { roomID } = await fetched.json()
     console.log(roomID);
     window.location = `/${roomID}`
     } catch(err) {
          window.alert('No code found.')
     }
})

getElement('id', 'createRoom', true).addEventListener('click', async (e) => {
     e.preventDefault();
     try {
          const options = {
               'method': 'POST',
               'headers': {
                    'content-type': 'application/json'
               },
               'body': JSON.stringify({ createRoom: true})
          }
          let { roomID } = await fetch(`/placeholder`, options).then((res) => res.json())
          console.log(roomID);
          window.location = `/${roomID}`
          } catch(err) {
              console.log(err)
          }
})

