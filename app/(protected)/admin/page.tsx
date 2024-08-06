"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function Administrators() {
  const router = useRouter()
  useEffect(() => { 
    router.replace("/admin/dashboard")
  }, [])

  return null
}

export default Administrators

