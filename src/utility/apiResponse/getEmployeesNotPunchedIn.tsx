export const fetchEmployeesNotPunchedInToday = async (date: string) => {
    let token: string | null = null;

    if (typeof window !== "undefined") {
        token = localStorage?.getItem("token");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/punch/employees-not-punches-by-date?date=${date}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch punches');
    }

    const punchesData = await response.json();

    console.log('punchesData:', punchesData);

    return punchesData;
};
