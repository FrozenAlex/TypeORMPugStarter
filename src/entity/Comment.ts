import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Post from "./Post";

/**
 * Site comments
 */
@Entity()
export default class Comment {
	@PrimaryGeneratedColumn()
    id: number;

    @Column({length:255})
    title: string;
    
    @Column({length: 255})
    author: string;
    
    // TODO: Figure out the max size
	@Column()
	content: string;

    // Many to one realtion
	@ManyToOne((type) => Post, (post) => post.comments, {onDelete: "CASCADE"})
	post: Post;
}
