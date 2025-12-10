import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";

const GITHUB_API_URL = "https://api.github.com/";
const GITHUB_API_TOKEN = "ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}user/repos`, {
            headers: {
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            },
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
            }
        });
        const repositories: RepositoryItem[] = response.data.map((repo: any) => ({
            name: repo.name,
            description: repo.description ? repo.description : null,
            owner: repo.owner? repo.owner.login : null,
            lenguaje: repo.language ? repo.language : null,
        }));
        return repositories;
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }
}