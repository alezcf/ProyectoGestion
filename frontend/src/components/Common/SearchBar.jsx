// src/components/Common/SearchBar.js
import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SearchBar = ({ searchQuery, handleSearchChange }) => (
    <Form.Group className="mb-4">
        <Form.Control
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar producto..."
            className="form-control"
        />
    </Form.Group>
);

SearchBar.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
};

export default SearchBar;
