using System;
using System.Collections.Generic;
using Ecommerce3BRO.Model;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Data;

public partial class Ecommerce3BROContext : DbContext
{
    public Ecommerce3BROContext(DbContextOptions<Ecommerce3BROContext> options)
        : base(options)
    {
    }

    public  DbSet<ActivationCode> ActivationCode { get; set; }

    public  DbSet<Cart> Cart { get; set; }

    public  DbSet<CartItem> CartItem { get; set; }

    public  DbSet<Category> Category { get; set; }

    public  DbSet<DeletedOrder> DeletedOrder { get; set; }

    public  DbSet<DeletedOrderItem> DeletedOrderItem { get; set; }

    public  DbSet<DeletedProduct> DeletedProduct { get; set; }

    public  DbSet<DeletedUser> DeletedUser { get; set; }

    public  DbSet<Discount> Discount { get; set; }

    public DbSet<Order> Order { get; set; }

    public  DbSet<OrderDetail> OrderDetail { get; set; }

    public DbSet<OrderDiscount> OrderDiscount { get; set; }

    public  DbSet<Payment> Payment { get; set; }

    public  DbSet<Product> Product{ get; set; }

    public  DbSet<Review> Review { get; set; }

    public  DbSet<Role> Role { get; set; }

    public  DbSet<Shipment> Shipment { get; set; }

    public  DbSet<User> User { get; set; }

    public DbSet<UserRole> UserRole { get; set; }

 }
