import { User } from "@/types/UserDetailProps";
import axios from "axios";
import { debounce } from "lodash";

const error = 'Falha ao pesquisar usuários. Por favor, tente novamente mais tarde.';

interface ApiResponse<T> {
    status: number;
    data: T;
}

const handleResponse = (response: ApiResponse<User[]>): User[] => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    throw new Error(error);
};
  
const debouncedSearch = debounce(async (query: string, setLoading: (loading: boolean) => 
    void, setFilteredUsers: (users: User[]) => void, setError: (error: string | null) => void, initialUsers: User[]) => {
            
    if (!query) {
        setFilteredUsers(initialUsers);
        setError(null);
        return;
    }

    setLoading(true);

    axios.get(`/api/searchUsers?query=${encodeURIComponent(query)}`)
        .then(response => {
            const result = handleResponse(response);

            if (result.length > 0) {
                setFilteredUsers(result);
                setError(null);
            } else {
                setFilteredUsers([]);
                setError('Nenhum usuário encontrado.');
            }
        })
        .catch(() => {
            setFilteredUsers([]);
            setError(error);
        })
        .finally(() => {
            setLoading(false);
        });
}, 300);
  
export default debouncedSearch;