import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogPost } from './blog.entity';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Resolver(() => BlogPost)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @Mutation(() => BlogPost)
  @UseGuards(SupabaseAuthGuard)
  async createBlogPost(
    @Args('title') title: string,
    @Args('content') content: string,
    @Context() context,
  ) {
    return this.blogService.createPost(title, content, context.req.user.id);
  }

  @Query(() => BlogPost)
  async getBlogPost(@Args('id') id: string) {
    return this.blogService.getPost(id);
  }

  @Query(() => [BlogPost])
  async getAllBlogPosts() {
    return this.blogService.getAllPosts();
  }

  @Query(() => [BlogPost])
  @UseGuards(SupabaseAuthGuard)
  async getMyBlogPosts(@Context() context) {
    if (!context.req?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    return this.blogService.getUserPosts(context.req.user.id);
  }

  @Mutation(() => BlogPost)
  @UseGuards(SupabaseAuthGuard)
  async updateBlogPost(
    @Args('id') id: string,
    @Args('title') title: string,
    @Args('content') content: string,
    @Context() context,
  ) {
    return this.blogService.updatePost(id, title, content, context.req.user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(SupabaseAuthGuard)
  async deleteBlogPost(
    @Args('id') id: string,
    @Context() context,
  ) {
    await this.blogService.deletePost(id, context.req.user.id);
    return true;
  }
} 