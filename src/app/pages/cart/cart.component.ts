import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {

  cart: Cart = { items: []};

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ];


  constructor(private cartService: CartService, private http: HttpClient) { }
  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart)=>{
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearAllCart(): void{
    this.cartService.clearCart()
  }

  onRemoveItemCart(item: CartItem): void {
    this.cartService.removeItemCart(item);
  }

  RemoveQuantityCart(item: CartItem): void {
    this.cartService.removeItemQuantityCart(item);
  }

  AddQuantityCart(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onCheckout(): void{
    this.http.post('http://localhost:4242/checkout',{
      items: this.cart.items
    }).subscribe(async (res: any)=> {
      let stripe = await loadStripe('pk_test_51NklJKSGukokBo2w28fNvAKdgk2pFBeDCqZB7JQStdvGePlBejzOMnvgpI6qRnJiGNId3i7EEW9fEsmYywLX0zRJ0025uvI1Pe');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    })
  }
}
