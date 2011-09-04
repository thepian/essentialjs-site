import ctypes

__all__ = ('XML_COMBINED_VERSION', 'XML_Char', 'XML_Content', 'XML_Encoding', 'XML_FALSE', 'XML_PARAM_ENTITY_PARSING_ALWAYS', 'XML_PARAM_ENTITY_PARSING_NEVER', 'XML_PARAM_ENTITY_PARSING_UNLESS_STANDALONE', 'XML_TRUE')

XML_COMBINED_VERSION = 20001
XML_Char = ctypes.c_char
class XML_Content(ctypes.Structure):
    _fields_ = [
        ('type', ctypes.c_uint),
        ('quant', ctypes.c_uint),
        ('name', ctypes.c_char_p),
        ('numchildren', ctypes.c_uint),
        ('_pad0', ctypes.c_char),
        ('_pad1', ctypes.c_char),
        ('_pad2', ctypes.c_char),
        ('_pad3', ctypes.c_char),
        ('children', ctypes.c_void_p),
    ]
class XML_Encoding(ctypes.Structure):
    _fields_ = [
        ('map', ctypes.c_int*256),
        ('data', ctypes.c_void_p),
        ('convert', ctypes.c_void_p),
        ('release', ctypes.c_void_p),
    ]
XML_FALSE = 0
XML_PARAM_ENTITY_PARSING_ALWAYS = 2
XML_PARAM_ENTITY_PARSING_NEVER = 0
XML_PARAM_ENTITY_PARSING_UNLESS_STANDALONE = 1
XML_TRUE = 1
