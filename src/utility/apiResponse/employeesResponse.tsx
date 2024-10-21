


export const apiResponse = async (): Promise<any> => {
  const page = 1;
  const limit = 0;
  const keyword = '';

  const token = localStorage?.getItem("token") || '{}';

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/employees/get?page=${page}&limit=${limit}&keyword=${keyword}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const employees = await response.json();


    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const employeesCountResponse = async (): Promise<any> => {

  const token = localStorage?.getItem("token") || '{}';

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/employees/all-employees-count`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const employees = await response.json();

    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};
