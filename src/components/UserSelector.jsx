import React, { useState, useCallback } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";

const UserSelector = () => {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [userData, setUserData] = useState([]);
    const [filteredUser, setFilteredUser] = useState(null);

    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch user data on component mount
    React.useEffect(() => {
        fetchUserData();
    }, []);

    // Memoized handler function
    const handleUserSelect = useCallback((userId) => {
        const user = userData.find(user => user.id === parseInt(userId)) || null;
        setFilteredUser(user);
    }, [userData]);

    // Handle input change and select user
    const handleInputChange = (e) => {
        const newUserId = e.target.value;
        setSelectedUserId(newUserId);
        handleUserSelect(newUserId);
    };

    return (
        <Container className="mt-5">
            <h1>Select a User</h1>
            <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                <Form.Group controlId="userId">
                    <Form.Label>Enter User ID</Form.Label>
                    <Form.Control
                        type="number"
                        value={selectedUserId}
                        onChange={handleInputChange}
                        placeholder="Enter user ID"
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                    Find User
                </Button>
            </Form>

            {filteredUser ? (
                <Card className="mt-4 mb-3">
                    <Card.Body>
                        <Card.Title>{filteredUser.name}</Card.Title>
                        <Card.Text>Email: {filteredUser.email}</Card.Text>
                        <Card.Text>Phone: {filteredUser.phone}</Card.Text>
                    </Card.Body>
                </Card>
            ) : (
                userData.map((user) => (
                    <Card key={user.id} className="mb-3">
                        <Card.Body>
                            <Card.Title>{user.name}</Card.Title>
                            <Card.Text>Email: {user.email}</Card.Text>
                            <Card.Text>Phone: {user.phone}</Card.Text>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default UserSelector;