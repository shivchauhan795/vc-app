import './App.css'

function App() {

  return (
    <div className='flex flex-col justify-evenly items-center mt-10 h-screen'>

      <div className=' w-fit flex justify-center items-center flex flex-col'>
        <input type="text" className='text-3xl border m-5 pl-2 py-1' placeholder='user id' />
        <input type="text" className='text-3xl border m-5 pl-2 py-1' placeholder='channel name' />
        <div className='flex gap-2'>

          <button className='bg-green-300 text-black w-20 p-3 h-fit cursor-pointer'>Join</button>
          <button className='bg-red-300 text-black w-20 p-3 h-fit cursor-pointer'>Hangup</button>
        </div>
      </div>
      <div className='flex gap-5'>
        <video id='peerPlayer' className='border' autoPlay></video>
        <video id='localPlayer' className='border' autoPlay></video>
      </div>
    </div>
  )
}

export default App
