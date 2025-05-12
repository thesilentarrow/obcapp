package expo.modules.mymodule

import android.content.Context
import android.content.ContextWrapper
import android.content.pm.PackageManager
import android.content.pm.Signature
import android.util.Base64
import android.util.Log
import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.util.*

/**
 * Helper class to generate app hash for SMS Retriever API
 */
class AppSignatureHelper(context: Context) : ContextWrapper(context) {
    companion object {
        private const val TAG = "AppSignatureHelper"
        private const val HASH_TYPE = "SHA-256"
        private const val NUM_HASHED_BYTES = 9
        private const val NUM_BASE64_CHAR = 11
    }

    /**
     * Get all the app signatures for the current package
     */
    fun getAppSignatures(): ArrayList<String> {
        val appSignatures = ArrayList<String>()

        try {
            // Get all signatures of our package
            val packageName = packageName
            val packageManager = packageManager
            val signatures = packageManager.getPackageInfo(packageName, PackageManager.GET_SIGNATURES).signatures

            // For each signature create a hash
            for (signature in signatures) {
                val hash = getHash(packageName, signature)
                if (hash != null) {
                    appSignatures.add(hash)
                }
            }
        } catch (e: PackageManager.NameNotFoundException) {
            Log.e(TAG, "Unable to find package to obtain signatures", e)
        }

        return appSignatures
    }

    private fun getHash(packageName: String, signature: Signature): String? {
        val appInfo = "$packageName ${signature.toCharsString()}"
        try {
            val messageDigest = MessageDigest.getInstance(HASH_TYPE)
            messageDigest.update(appInfo.toByteArray(StandardCharsets.UTF_8))
            
            // Truncate to the first 9 bytes
            val hashBytes = messageDigest.digest()
            val truncatedHash = Arrays.copyOfRange(hashBytes, 0, NUM_HASHED_BYTES)
            
            // Base64 encode
            val base64Hash = Base64.encodeToString(truncatedHash, Base64.NO_PADDING or Base64.NO_WRAP)
            
            // Make sure to use the right length
            if (base64Hash.length > NUM_BASE64_CHAR) {
                return base64Hash.substring(0, NUM_BASE64_CHAR)
            }
            return base64Hash
        } catch (e: NoSuchAlgorithmException) {
            Log.e(TAG, "Hash algorithm not found", e)
        }
        return null
    }
}