import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Home = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = sessionStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [])

  return <></>
}

export default Home
