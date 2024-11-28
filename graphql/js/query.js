export async function fetchUserData(userId, jwt) {
    const query = `
    query user($userId: Int!) {
        user: user_by_pk(id: $userId) {
            login
            firstName
            lastName
            email
            auditRatio
            transactions (
                order_by: [{ type: desc }, { amount: desc }]
                distinct_on: [type]
                where: { userId: { _eq: $userId }, type: { _like: "skill_%" } }
            ) {
                type
                amount
            }
        }
    }`;

    const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query,
            variables: { userId }
        })
    });

    const result = await response.json();
    console.log('Résultat brut de l\'API:', result);

    return result.data && result.data.user ? result.data.user : null;
}
