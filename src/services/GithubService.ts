import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import AuthService from "./AuthService";
import { UserInfo } from "../interfaces/UserInfo";

const GITHUB_API_URL = import.meta.env.VITE_API_URL;

const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
});

githubApi.interceptors.request.use((config) => {
    const AuthHeaders = AuthService.getAuthHeaders();
    if (AuthHeaders) {
        config.headers.Authorization = AuthHeaders;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});





export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
  try {
    const response = await githubApi.get(`/user/repos`, {
      params: {
        per_page: 100,
        sort: "created",
        direction: "desc",
        affiliation: "owner",
      },
    });

    return response.data.map((repo: any) => ({
      name: repo.name,
      description: repo.description ?? null,
      imageUrl: repo.owner?.avatar_url ?? null,
      owner: repo.owner?.login ?? null,
      language: repo.language ?? null,
    }));
  } catch (error) {
    console.error("Hubo un error al obtener repositorios:", error);
    return [];
  }
};

export const createRepository = async (repo: RepositoryItem): Promise<void> => {
  try {
    const response = await githubApi.post(`/user/repos`,repo);
    console.log("Repositorio creado:", response.data);
  } catch (error) {
    console.error("Error al crear el repositorio:", error);
  }
};


export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await githubApi.get(`/user`);
    return {
      login: response.data.login,
      name: response.data.name,
      bio: response.data.bio,
      avatar_url: response.data.avatar_url,
    };
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
    return {
      login: "undefined",
      name: "Usuario no encontrado",
      bio: "No se pudo obtener la información del usuario",
      avatar_url: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/icon-image-not-found-free-vector.jpg",
    };
  }
};