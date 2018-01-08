namespace TodoAspNetCore
{
    public static class Constants
    {
        public const string PasswordRegex = @"^[a-zA-Z0-9 +-/*]{5,20}$";
        public const string UsernameRegex = @"^[a-zA-Z0-9]{5,20}$";
        public const string TitleRegex = @"^[a-zA-Z0-9 ,+\-\.]$";

        public const string Secret = "kgYXVES7z9psK/9MMp5WLoaj4buGrlpUr8f8POWfmI6FHCZGmLs+zEJllmTFSZo+AiwG+9wQlvOL7vg/gKiv6w==";
        public const string Issuer = "Rud156:Sonu5";

        public const string defaultCategoryName = "Todo";
    }
}