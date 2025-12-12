import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserStorageService } from '../services/storage/user-storage.service';

@Injectable({
    providedIn: 'root'
})
export class FinanceService {

    private API = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    // ⭐ Get JWT Token Headers
    private getHeaders() {
        const token = UserStorageService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    // ============================
    //          PAYMENTS
    // ============================

    savePayment(data: any) {
        return this.http.post(`${this.API}/payments`, data, {
            headers: this.getHeaders()
        });
    }

    getPayments() {
        return this.http.get(`${this.API}/payments`, {
            headers: this.getHeaders()
        });
    }

    deletePayment(id: number) {
        return this.http.delete(`${this.API}/payments/${id}`, {
            headers: this.getHeaders()
        });
    }

    getPaymentById(id: number) {
        return this.http.get(`${this.API}/payments/single/${id}`, {
            headers: this.getHeaders()
        });
    }

    updatePayment(id: number, data: any) {
        return this.http.put(`${this.API}/payments/${id}`, data, {
            headers: this.getHeaders()
        });
    }

    // ============================
    //          RECEIPTS
    // ============================

    saveReceipt(data: any) {
        return this.http.post(`${this.API}/receipts`, data, {
            headers: this.getHeaders()
        });
    }

    getReceipts() {
        return this.http.get(`${this.API}/receipts`, {
            headers: this.getHeaders()
        });
    }

    deleteReceipt(id: number) {
        return this.http.delete(`${this.API}/receipts/${id}`, {
            headers: this.getHeaders()
        });
    }

    getReceiptById(id: number) {
        return this.http.get(`${this.API}/receipts/single/${id}`, {
            headers: this.getHeaders()
        });
    }

    updateReceipt(id: number, data: any) {
        return this.http.put(`${this.API}/receipts/${id}`, data, {
            headers: this.getHeaders()
        });
    }

    getCustomerLedger(customerId: number) {
        return this.http.get(`${this.API}/receipts/ledger/${customerId}`, {
            headers: this.getHeaders()
        });
    }

    // ============================
    //          USERS
    // ============================
    getUsers() {
        return this.http.get(`${this.API}/user/all`, {
            headers: this.getHeaders()
        });
    }

    // ⭐ REQUIRED FOR PARENT IMAGE & NAME
    getUserById(id: number) {
        return this.http.get(`${this.API}/user/${id}`, {
            headers: this.getHeaders()
        });
    }





}
