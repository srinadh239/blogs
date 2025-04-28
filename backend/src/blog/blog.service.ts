import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { BlogPost } from './blog.entity';

@Injectable()
export class BlogService {
  private supabase;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async createPost(title: string, content: string, authorId: string): Promise<BlogPost> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .insert([
        {
          title,
          content,
          author_id: authorId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return this.mapToBlogPost(data);
  }

  async getPost(id: string): Promise<BlogPost> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.mapToBlogPost(data);
  }

  async getUserPosts(authorId: string): Promise<BlogPost[]> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapToBlogPost);
  }

  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapToBlogPost);
  }

  async updatePost(id: string, title: string, content: string, authorId: string): Promise<BlogPost> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .update({ title, content })
      .eq('id', id)
      .eq('author_id', authorId) // Ensure user owns the post
      .select()
      .single();

    if (error) throw error;
    return this.mapToBlogPost(data);
  }

  async deletePost(id: string, authorId: string): Promise<void> {
    const { error } = await this.supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
      .eq('author_id', authorId); // Ensure user owns the post

    if (error) throw error;
  }

  private mapToBlogPost(data: any): BlogPost {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      authorId: data.author_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
} 