
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Model;

[Table("User")]
[Index("Email", Name = "UQ__User__A9D10534E155E666", IsUnique = true)]
public partial class User
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(100)]
    public string? FullName { get; set; }

    [StringLength(100)]
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is invalid")]
    public string Email { get; set; }

    [StringLength(255)]
    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must have more  8 characters")]
    public string Password { get; set; }

    [StringLength(20)]
    [RegularExpression(@"^(0[3|5|7|8|9])[0-9]{8}$",
        ErrorMessage = "Phone number is invalid")]
    public string? Phone { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }

    public DateTime? CreatedDate { get; set; }

    
    public  ICollection<ActivationCode> ActivationCodes { get; set; } 

    
    public  ICollection<Cart> Carts { get; set; } 


    public  ICollection<Order> Orders { get; set; } 

   
    public  ICollection<Review> Reviews { get; set; } 

    
    public  ICollection<UserRole> UserRoles { get; set; } 
}
