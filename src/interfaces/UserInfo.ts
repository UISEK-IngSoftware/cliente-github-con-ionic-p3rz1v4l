export interface UserInfo {
    login: string;
    name: string;
    bio: string;
    avatar_url: string;
    company?: string | null;
    location?: string | null;
    email?: string | null;
    blog?: string | null;
    twitter_username?: string | null;
    public_repos?: number;
    public_gists?: number;
    followers?: number;
    following?: number;
    created_at?: string;
    updated_at?: string;
}