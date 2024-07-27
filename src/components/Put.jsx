import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CrudPut = () => {
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);


    const mutateUpdatePost = useMutation({
        mutationFn: async ({ id, title, body }) => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ id, title, body }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to update post');
            }
            return response.json();
        },
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            console.log('Post updated with ID:', data.id);
            queryClient.invalidateQueries(['posts']); 
            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
        onError: (error) => {
            console.error('Error updating post:', error);
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const actionType = formData.get('actionType');

        if (actionType === 'update') {
            const updatedPost = {
                id: parseInt(formData.get('postId')),
                title: formData.get('title'),
                body: formData.get('body'),
            };
            mutateUpdatePost.mutate(updatedPost);
        }
    };

    return (
        <div> 
            {mutateUpdatePost.isError && <Alert variant="danger">An Error has occurred: {mutateUpdatePost.error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">Action completed successfully!</Alert>}
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit} className="my-3">
                    <Form.Group className="mb-3" controlId="actionType">
                        <Form.Label>Action Type</Form.Label>
                        <Form.Control as="select" name="actionType" required>
                            <option value="update">Update</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="postId">
                        <Form.Label>Post ID</Form.Label>
                        <Form.Control type="number" placeholder="Enter post ID" name="postId" min="1" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" name="title" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control name="body" as="textarea" rows={3} required />
                    </Form.Group>
                    {mutateUpdatePost.isLoading ? (
                        <Button variant="primary" disabled>
                            Loading...
                        </Button>
                    ) : (
                        <Button variant="primary" type="submit">
                            Perform Action
                        </Button>
                    )}
                </Form>
            </Col>
        </div>
    );
};

export default CrudPut;