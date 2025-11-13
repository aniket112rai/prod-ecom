// frontend/src/components/admin/UserRow.jsx
import React from "react";

const UserRow = ({ user }) => {
  const isAdmin = user.role === "admin";

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 group">
      
      {/* Name Column with Avatar */}
      <td className="p-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold uppercase shadow-sm ${
            isAdmin 
              ? "bg-indigo-100 text-indigo-600" 
              : "bg-slate-200 text-slate-600"
          }`}>
            {user.name ? user.name.charAt(0) : "U"}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">{user.name}</span>
          </div>
        </div>
      </td>

      {/* Email Column */}
      <td className="p-4 whitespace-nowrap text-sm text-slate-500">
        {user.email}
      </td>

      {/* Role Column (Badge) */}
      <td className="p-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
          isAdmin
            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
            : "bg-slate-100 text-slate-600 border-slate-200"
        }`}>
          {isAdmin ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
          {user.role}
        </span>
      </td>

      {/* Empty Action Column (To align with table header) */}
      <td className="p-4 text-right whitespace-nowrap text-sm font-medium">
        
        
      </td>
    </tr>
  );
};

export default UserRow;