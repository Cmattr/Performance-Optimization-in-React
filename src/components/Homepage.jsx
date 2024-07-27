import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner, Alert, Form, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Container, Card } from "react-bootstrap";

// Fetch posts function
const fetchPost = async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    const info = await response.json();
    return info;
};

const DisplayFilter = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['info'],
        queryFn: fetchPost,
    });

    const [postId, setPostId] = useState('');

    // Handle input change
    const handleInputChange = (e) => {
        setPostId(e.target.value);
    };

    // Memoize filtered post
    const filteredPost = useMemo(() => {
        return data ? data.find(post => post.id === parseInt(postId)) || null : null;
    }, [data, postId]);

    if (isLoading) return <Spinner animation="border" role="status"><span className='visually-hidden'>Loading...</span></Spinner>;
    if (isError) return <Alert variant="danger">{error.message}</Alert>;

    if (!data || !Array.isArray(data)) {
        return null; 
    }

    return (
        <Container className="mt-5">
            <h1>Welcome To The Blog</h1>
            <NavLink to="/Add">Add Post</NavLink> <br/>
            <NavLink to="/Delete">Delete Post</NavLink> <br/>
            <NavLink to="/Put">Update Post</NavLink> <br/>
            <NavLink to='/UserSelector'>Select User</NavLink>

            <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                <Form.Group controlId="postId">
                    <Form.Label>Enter Post ID</Form.Label>
                    <Form.Control
                        type="number"
                        value={postId}
                        onChange={handleInputChange}
                        placeholder="Enter post ID"
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                    Find Post
                </Button>
            </Form>

            {filteredPost ? (
                <Card className="mt-4 mb-3">
                    <Card.Body>
                        <Card.Title>{filteredPost.title}</Card.Title>
                        <Card.Text>{filteredPost.body}</Card.Text>
                    </Card.Body>
                </Card>
            ) : (
                data.map((info) => (
                    <Card key={info.id} className="mb-3">
                        <Card.Body>
                            <Card.Title>{info.title}</Card.Title>
                            <Card.Text>{info.body}</Card.Text>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default DisplayFilter;
