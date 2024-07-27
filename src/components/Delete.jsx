import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CrudDelete = () => {
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [actionType, setActionType] = useState('delete');


    const mutateDeletePost = useMutation({
        mutationFn: async (postId) => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            return postId;
        },
        onSuccess: (deletedPostId) => {
            setShowSuccessAlert(true);
            console.log('Post deleted with ID:', deletedPostId);
            queryClient.invalidateQueries(['posts']);

            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
        onError: (error) => {
            console.error('Error deleting post:', error);
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        if (actionType === 'delete') {
            const postIdToDelete = parseInt(formData.get('postId'));
            if (isNaN(postIdToDelete)) {
                console.error('Invalid Post ID');
                return;
            }
            mutateDeletePost.mutate(postIdToDelete);
        }

        event.target.reset();
    }

    return (
        <div>
            {mutateDeletePost.isError && <Alert variant="danger">An Error has occurred: {mutateDeletePost.error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">Action completed successfully!</Alert>}
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit} className="my-3">
                    <Form.Group className="mb-3" controlId="actionType">
                        <Form.Label>Action Type</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="actionType" 
                            required 
                            onChange={(e) => setActionType(e.target.value)}
                        >
                            <option value="delete">Delete</option>
                        </Form.Control>
                    </Form.Group>
                    {actionType === 'delete' && (
                        <Form.Group className="mb-3" controlId="postId">
                            <Form.Label>Post ID</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter Post ID" 
                                name="postId" 
                                min="1" 
                                required 
                            />
                        </Form.Group>
                    )}
                    {mutateDeletePost.isLoading ? (
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
}

export default CrudDelete;