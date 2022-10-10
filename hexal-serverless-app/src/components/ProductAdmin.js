import React, { Component, Fragment } from "react";
import Product from "./Product";
import axios from "axios";
const config = require("../config.json");

export default class ProductAdmin extends Component {
  state = {
    newproduct: {
      productName: "",
      id: "",
    },
    products: [],
  };

  handleAddProduct = async (id, event) => {
    event.preventDefault();

    const params = {
      id: id,
      productName: this.state.newproduct.productName,
    };

    await axios
      .post(`${config.api.invokeUrl}/products/{id}`, params)
      .then(() => {
        this.setState({
          products: [...this.state.products, this.state.newproduct],
        });
        this.setState({ newproduct: { productName: "", id: "" } });
      })
      .catch((e) => console.log("axios", e));
  };

  handleUpdateProduct = async (id, name) => {
    const params = {
      id: id,
      productName: name,
    };

    await axios
      .patch(`${config.api.invokeUrl}/products/{id}`, params)
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          return this.updateProductsAfterPatch(id, name);
        }
        throw new Error(`Unable to update product id: ${id}`);
      })
      .catch((e) => console.log("Unable to update product", e));
  };

  updateProductsAfterPatch = (id, name) => {
    const productToUpdate = [...this.state.products].find(
      (product) => product.id === id
    );
    const updatedProducts = [...this.state.products].filter(
      (product) => product.id !== id
    );
    productToUpdate.productName = name;
    updatedProducts.push(productToUpdate);
    this.setState({ products: updatedProducts });
  };

  handleDeleteProduct = async (id, event) => {
    event.preventDefault();
    const url = `${config.api.invokeUrl}/products/${id}`;
    await axios
      .delete(url)
      .then((res) => {
        console.log(res);
        const updatedProducts = [...this.state.products].filter(
          (product) => product.id !== id
        );
        this.setState({ products: updatedProducts });
      })
      .catch((e) => console.log("axios: unable to delete", e));
  };

  fetchProducts = async () => {
    await axios
      .get(`${config.api.invokeUrl}/products`)
      .then((response) => this.setState({ products: response.data }))
      .catch((e) => console.log(e));
  };

  onAddProductNameChange = (event) =>
    this.setState({
      newproduct: { ...this.state.newproduct, productName: event.target.value },
    });
  onAddProductIdChange = (event) =>
    this.setState({
      newproduct: { ...this.state.newproduct, id: event.target.value },
    });

  componentDidMount = () => {
    this.fetchProducts();
  };

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Product Admin</h1>
            <p className="subtitle is-5">
              Add and remove products using the form below:
            </p>
            <br />
            <div className="columns">
              <div className="column is-one-third">
                <form
                  onSubmit={(event) =>
                    this.handleAddProduct(this.state.newproduct.id, event)
                  }
                >
                  <div className="field has-addons">
                    <div className="control">
                      <input
                        className="input is-medium"
                        type="text"
                        placeholder="Enter name"
                        value={this.state.newproduct.productName}
                        onChange={this.onAddProductNameChange}
                      />
                    </div>
                    <div className="control">
                      <input
                        className="input is-medium"
                        type="text"
                        placeholder="Enter id"
                        value={this.state.newproduct.id}
                        onChange={this.onAddProductIdChange}
                      />
                    </div>
                    <div className="control">
                      <button
                        type="submit"
                        className="button is-primary is-medium"
                      >
                        Add product
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="column is-two-thirds">
                <div className="tile is-ancestor">
                  <div className="tile is-4 is-parent  is-vertical">
                    {this.state.products.map((product, index) => (
                      <Product
                        isAdmin={true}
                        handleUpdateProduct={this.handleUpdateProduct}
                        handleDeleteProduct={this.handleDeleteProduct}
                        name={product.productName}
                        id={product.id}
                        key={product.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
