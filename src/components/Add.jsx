import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CrudAdd = React.memo(() => {
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const navigate = useNavigate();

    const mutateAddPost = useMutation({
        mutationFn: async (newPost) => {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(newPost),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to add post');
            }
            return response.json();
        },
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            console.log('Post added with ID:', data.id);
            queryClient.invalidateQueries(['posts']);
            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
        onError: (error) => {
            console.error('Error adding post:', error);
        },
    });

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const actionType = formData.get('actionType');

        if (actionType === 'add') {
            const newPost = {
                title: formData.get('title'),
                body: formData.get('body'),
                userId: parseInt(formData.get('userId')),
            };
            mutateAddPost.mutate(newPost);
        }
    }, [mutateAddPost]);

    return (
        <div>
            {mutateAddPost.isError && <Alert variant="danger">An Error has occurred: {mutateAddPost.error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">Action completed successfully!</Alert>}
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit} className="my-3">
                    <Form.Group className="mb-3" controlId="actionType">
                        <Form.Label>Action Type</Form.Label>
                        <Form.Control as="select" name="actionType" required>
                            <option value="add">Add</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" name="title" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control name="body" as="textarea" rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="userId">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control type="number" placeholder="Enter user ID" name="userId" min="1" required />
                    </Form.Group>
                    {mutateAddPost.isLoading ? (
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
});

export default CrudAdd;
