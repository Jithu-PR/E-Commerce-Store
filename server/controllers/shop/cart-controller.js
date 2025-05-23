const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided!',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found!',
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'error',
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User Id is mandatory!',
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'image title price salePrice',
    });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found!',
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId,
    );
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'error',
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided!',
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found!',
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not present!',
      });
    }

    // Update the quantity of the product
    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    // Populate the cart with the updated product data (after saving)
    await cart.populate({
      path: 'items.productId', // Corrected this line
      select: 'image title price salePrice', // Select the relevant fields
    });

    // Prepare response with populated items
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : 'Product not found!',
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    // Return the updated cart with the populated items
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Validate the request parameters
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid data provided! Both userId and productId are required.',
      });
    }

    // Find the cart for the given userId and populate the product details
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'image title price salePrice', // Only select these fields
    });

    // Check if the cart was found
    if (!cart) {
      console.log('Cart not found for userId:', userId);
      return res.status(404).json({
        success: false,
        message: 'Cart not found!',
      });
    }

    // Filter out the item to be deleted
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId,
    );

    // If no items are left, return a message
    if (cart.items.length === initialItemCount) {
      console.log('Product not found in cart for productId:', productId);
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart!',
      });
    }

    // Save the updated cart after removal
    await cart.save();

    // Map the cart items to return a clean response
    const populatedCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : 'Product not found',
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    // Return the updated cart
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        error.message || 'An error occurred while deleting the cart item.',
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
};
