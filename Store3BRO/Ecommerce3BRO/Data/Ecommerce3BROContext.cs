
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
    public DbSet<Refund> Refund { get; set; }
    public DbSet<ProductImage> ProductImage { get; set; }
    public DbSet <RefreshToken> RefreshToken { get; set; }
    public DbSet <UserLocation> UserLocation { get; set; }
    public DbSet<Support> Support { get; set; }

    }
