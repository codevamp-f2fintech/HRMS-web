export const apiResponse = async () => {
  const page = 1;
  const limit = 0;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/employees/get?page=${page}&limit=${limit}`
  );

  const employees = await response.json();

  console.log('employees:', employees);

  return employees;
};
