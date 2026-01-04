//using System.ComponentModel.DataAnnotations;
//using System.Reflection;

//namespace Ecommerce3BRO.Helper.Extension
//{
//    public static class EnumExtension
//    {
//        public static string GetDisplayName(this System.Enum enumValue)
//        {
//            return enumValue
//                .GetType()
//                .GetMember(enumValue.ToString())
//                .FirstOrDefault()?
//                .GetCustomAttribute<DisplayAttribute>()?
//                .Name
//                ?? enumValue.ToString();
//        }

//    }
//}
