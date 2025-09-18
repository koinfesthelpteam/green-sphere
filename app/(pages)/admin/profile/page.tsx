import ProfilePage from '@/components/admin/ProfilePage'
import AdminLayout from '@/components/admin/AdminLayout'

const page = () => {
  return (
    <div>
      <AdminLayout>
        <ProfilePage/>
      </AdminLayout>
    </div>
  )
}

export default page