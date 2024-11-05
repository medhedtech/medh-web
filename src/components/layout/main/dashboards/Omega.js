import React from 'react';

const DefineRoleForm = () => {
  return (
    <div className="flex items-start justify-center min-h-screen pt-9 bg-gray-100 p-8">
      <div className="bg-white w-full max-w-6xl p-8 md:p-10 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Define Role</h2>

        <form className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email id
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="abc@gmail.com"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="cooperate-admin">Cooperate Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Role Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Role Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Write description"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Permissions */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Permission</legend>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="permission" className="mr-2 text-indigo-600 focus:ring-indigo-500" />
                View Courses
              </label>
              <label className="flex items-center">
                <input type="radio" name="permission" className="mr-2 text-indigo-600 focus:ring-indigo-500" />
                Edit Users
              </label>
              <label className="flex items-center">
                <input type="radio" name="permission" className="mr-2 text-indigo-600 focus:ring-indigo-500" />
                Create Report
              </label>
            </div>
          </fieldset>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-customGreen text-white rounded-md"
            >
              Save Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DefineRoleForm;
