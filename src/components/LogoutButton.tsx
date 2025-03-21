'use client'
import { handleSignOut } from '@/lib/action';


export default function LogoutButton() {

  const onSignOut = async () => {
    await handleSignOut();
};

  return (
    <button 
      onClick={onSignOut}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
    >
      Logout
    </button>
  );
}