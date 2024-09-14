import type { NextApiRequest, NextApiResponse } from 'next';
import axiosInstance from '../../lib/axiosInstance';  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (typeof query !== 'string') {
    return res.status(400).json({ error: 'A busca deve ser string' });
  }

  try {
    const searchResult = await axiosInstance.get(`/search/users?q=${query}`);
    console.log("searchResult", searchResult)
    const usersData = searchResult.data.items || [];
    const userDetails = await Promise.all(
      usersData.map(async (user: { login: string }) => {
        try {
          const userRes = await axiosInstance.get(`/users/${user.login}`);
          return userRes.data;
        } catch (err) {
          console.error(`Error fetching details for user ${user.login}:`, err);
          return null;
        }
      })
    );

    const validUserDetails = userDetails.filter(user => user !== null);
    res.status(200).json(validUserDetails);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
}
