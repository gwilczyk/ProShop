import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
	createProduct,
	deleteProduct,
	listProducts
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../actions/productTypes';

const ProductListScreen = ({ history, match }) => {
	const dispatch = useDispatch();

	const { loading, error, products } = useSelector(state => state.productList);
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete
	} = useSelector(state => state.productDelete);
	const {
		loading: loadingCreate,
		error: errorCreate,
		success: successCreate,
		product: productCreate
	} = useSelector(state => state.productCreate);
	const { userInfo } = useSelector(state => state.userLogin);

	useEffect(() => {
		dispatch({ type: PRODUCT_CREATE_RESET });

		if (!userInfo.isAdmin) {
			history.push('/login');
		}

		if (successCreate) {
			history.push(`/admin/product/${productCreate._id}/edit`);
		} else {
			dispatch(listProducts());
		}
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		productCreate
	]);

	const createProductHandler = () => {
		dispatch(createProduct());
	};

	const deleteProductHandler = id => {
		if (window.confirm('Are you sure?')) {
			dispatch(deleteProduct(id));
		}
	};

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className='text-right'>
					<Button className='my-3' onClick={createProductHandler}>
						<i className='fas fa-plus' /> Create Product
					</Button>
				</Col>
			</Row>

			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger'>{errorDelete}</Message>}

			{loadingCreate && <Loader />}
			{errorCreate && <Message variant='danger'>{errorCreate}</Message>}

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>PRICE</th>
							<th>CATEGORY</th>
							<th>BRAND</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{products.map(product => (
							<tr key={product._id}>
								<td>{product._id}</td>
								<td>{product.name}</td>
								<td>${product.price}</td>
								<td>{product.category}</td>
								<td>{product.brand}</td>
								<td>
									<LinkContainer to={`/admin/product/${product._id}/edit`}>
										<Button variant='light' className='btn-sm'>
											<i className='fas fa-edit' />
										</Button>
									</LinkContainer>
									<Button
										variant='danger'
										className='btn-sm'
										onClick={() => deleteProductHandler(product._id)}
									>
										<i className='fas fa-trash' />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default ProductListScreen;
