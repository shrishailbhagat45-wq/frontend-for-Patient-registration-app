export default function Create() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 ">
        <div className="w-full max-w-md px-6">        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-2">
            HealSync360
          </h1>
          <p className="text-sm text-slate-500">Clinical Management System</p>
        </div>
        <form className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <h2 className="text-xl font-semibold text-slate-800 mb-5">Create Account</h2>
            <div className=' flex gap-4 mb-4'>
                <p className=' flex flex-col '>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                    <input type="text" id="firstName" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder='First Name' />
                </p>
                
                <p>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                    <input type="text" id="lastName" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder='Last Name' />
                </p>
            </div>
            <p>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input type="email" id="email" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder='Email' />
            </p>
            <p>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input type="password" id="password" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"     placeholder='Password' />
            </p>
            <button type='submit'>Create Account</button>
        </form>
        </div>
    </div>
  )
}
