import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Phone, Lock, User, CreditCard, Plus, Minus, ArrowLeft, Check } from 'lucide-react';

export default function UserRegister() {
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [familyMemberCount, setFamilyMemberCount] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 UPDATED HANDLE SUBMIT (Backend Connected)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const formData = new FormData(e.currentTarget);

    const rationNumber = formData.get('rationNumber') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (rationNumber.length < 10) {
      setError('Ration card number must be at least 10 characters');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: formData, // 🔥 IMPORTANT for file upload
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // ✅ SAVE USER LOCALLY (for login)
localStorage.setItem(
  `user_${formData.get('rationNumber')}`,
  JSON.stringify({
    headName: formData.get('headName'),   // 👈 ADD THIS
      username: formData.get('username'), 
    rationNumber: formData.get('rationNumber'),
    password: formData.get('password'),
  })
);

      setShowSuccess(true);
      setMessage('Registration successful! Redirecting...');

      setTimeout(() => {
        navigate('/user/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const incrementMembers = () => {
    if (familyMemberCount < 10) {
      setFamilyMemberCount(prev => prev + 1);
    }
  };

  const decrementMembers = () => {
    if (familyMemberCount > 1) {
      setFamilyMemberCount(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* CARD */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">

          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-xl mb-4">
              <FileText className="text-white w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-indigo-900">Ration Card Registration</h2>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* PERSONAL INFO */}
            <div className="bg-indigo-50 p-4 rounded-xl space-y-4">

              <input name="headName" placeholder="Head Name" required className="input" />
              <input name="username" placeholder="Username" required className="input" />
              <input name="rationNumber" placeholder="Ration Number" required className="input" />

              <input type="password" name="password" placeholder="Password" required className="input" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required className="input" />

              <input name="phone" placeholder="Phone" required className="input" />

            </div>

            {/* FAMILY MEMBERS */}
            <div className="bg-purple-50 p-4 rounded-xl">

              <div className="flex justify-between mb-3">
                <span>Family Members</span>

                <div className="flex gap-2">
                  <button type="button" onClick={decrementMembers}>-</button>
                  {familyMemberCount}
                  <button type="button" onClick={incrementMembers}>+</button>
                </div>
              </div>

              {Array.from({ length: familyMemberCount }).map((_, i) => (
                <div key={i} className="mb-2">
                  <input name={`memberName${i}`} placeholder={`Member ${i + 1}`} className="input" />
                </div>
              ))}

            </div>

            {/* FILE UPLOAD */}
            <div className="bg-orange-50 p-4 rounded-xl">

              <input
                type="file"
                name="rationCard"
                onChange={handleFileChange}
                required
              />

              <p>{fileName}</p>

            </div>

            {/* ERROR */}
            {error && <p className="text-red-500">{error}</p>}

            {/* SUCCESS */}
            {showSuccess && <p className="text-green-600">{message}</p>}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}