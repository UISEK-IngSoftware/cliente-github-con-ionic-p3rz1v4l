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

    interface GitHubRepo {
      name: string;
      description?: string | null;
      owner?: { avatar_url?: string | null; login?: string | null };
      language?: string | null;
    }

    return (response.data as GitHubRepo[]).map((repo) => ({
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

export const createRepository = async (
  name: string,
  description?: string,
  isPrivate: boolean = false
): Promise<void> => {
  try {
    const payload: { name: string; description?: string; private: boolean } = {
      name,
      description,
      private: isPrivate,
    };

    const response = await githubApi.post(`/user/repos`, payload);
    console.log('Repositorio creado:', response.data);
  } catch (error) {
    console.error('Error al crear el repositorio:', error);
    throw error;
  }
};


export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await githubApi.get(`/user`);
    return {
      login: response.data.login,
      name: response.data.name || response.data.login,
      bio: response.data.bio || null,
      avatar_url: response.data.avatar_url,
      company: response.data.company ?? null,
      location: response.data.location ?? null,
      email: response.data.email ?? null,
      blog: response.data.blog ?? null,
      twitter_username: response.data.twitter_username ?? null,
      public_repos: response.data.public_repos ?? 0,
      public_gists: response.data.public_gists ?? 0,
      followers: response.data.followers ?? 0,
      following: response.data.following ?? 0,
      created_at: response.data.created_at ?? null,
      updated_at: response.data.updated_at ?? null,
    } as UserInfo;
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
    return {
      login: "undefined",
      name: "Usuario no encontrado",
      bio: "No se pudo obtener la información del usuario",
      avatar_url: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/icon-image-not-found-free-vector.jpg",
      company: null,
      location: null,
      email: null,
      blog: null,
      twitter_username: null,
      public_repos: 0,
      public_gists: 0,
      followers: 0,
      following: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
};

export const updateRepository = async (
  owner: string,
  repoName: string,
  updates: { name?: string; description?: string; isPrivate?: boolean }
): Promise<void> => {
  try {
    const updateData: { name?: string; description?: string; private?: boolean } = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.isPrivate !== undefined) updateData.private = updates.isPrivate;

    const response = await githubApi.patch(`/repos/${owner}/${repoName}`, updateData);
    console.log('Repositorio actualizado:', response.data);
  } catch (error) {
    console.error('Error al actualizar el repositorio:', error);
    throw error;
  }
};

export const deleteRepository = async (owner: string, repoName: string): Promise<void> => {
  try {
    await githubApi.delete(`/repos/${owner}/${repoName}`);
    console.log('Repositorio eliminado');
  } catch (error) {
    console.error('Error al eliminar el repositorio:', error);
    throw error;
  }
};